# RAG Implementation Notes — YCM Backend

## Stack

| Component | Technology |
|-----------|------------|
| LLM | Google Gemini 2.5 Flash (`gemini-2.5-flash`) |
| Embeddings | Google Generative AI (`models/gemini-embedding-001`) |
| Vector dimension | 3072 |
| Text Splitter | RecursiveCharacterTextSplitter (chunk_size=1000, overlap=200) |
| Vector Storage | PostgreSQL + pgvector |
| Similarity | pgvector `<=>` operator (in SQL, DB-side) |

---

## Database

### VectorDB table (`Vectors`)
```
id          - PK
content_id  - FK to Content.id
user_id     - Integer (for user isolation)
chunk_text  - Text (raw chunk stored alongside embedding)
embedding   - Vector(3072)
```

---

## RAG Config File

`ragimp/contentrag.py`

- Loads `GOOGLE_API_KEY` from `.env`
- Initialises `llm`, `embeddings`, `text_splitter`
- Imported in `routers/content.py` as:
  ```python
  from ragimp.contentrag import text_splitter, embeddings, llm
  ```

---

## Write Path (embedding on save/update)

### `POST /setContent`
1. `db.flush()` to get `content_id` without committing
2. Build text from all content fields: `"key:value\n..."`
3. Split into chunks using `text_splitter.split_text(text)`
4. Embed chunks using `embeddings.embed_documents(chunks)`
5. Store each chunk + vector in `VectorDB`
6. `db.commit()` only if all embeddings succeed
7. On failure → `db.rollback()` (content row also removed), return HTTP 503

### `POST /updateContent`
1. Generate new embeddings first (before touching old vectors)
2. Only delete old vectors after new ones are successfully generated
3. On failure → `db.rollback()` (old vectors preserved), return HTTP 503

### `POST /deleteContent`
- Deletes associated `VectorDB` rows alongside the content row

---

## Read Path (RAG query)

### `POST /ask`

Request body (`askQuestionReq`):
```json
{ "question": "your question here" }
```

Flow:
1. Embed the question using `embeddings.embed_query(question)`
2. Run pgvector SQL query — top 5 chunks ranked by cosine distance in DB:
   ```sql
   SELECT chunk_text FROM "Vectors"
   WHERE user_id = :user_id
   ORDER BY embedding <=> CAST(:vec AS vector)
   LIMIT 5
   ```
3. Build context string from `chunk_text` of top matches
4. Build prompt with context + question
5. Call `llm.invoke(prompt)` → Gemini 2.5 Flash
6. Return `{ "answer": "..." }`

Prompt structure:
```
You are a helpful AI assistant.
Answer ONLY using the context below.
Rules: no hallucination, say "I don't know" if not in context, be concise.
Context: <top 5 chunks>
Question: <user question>
Answer:
```

---

## Error Handling

| Scenario | Behaviour |
|----------|-----------|
| Embedding API fails on create | Rollback content + vectors, HTTP 503 |
| Embedding API fails on update | Rollback, old vectors preserved, HTTP 503 |
| LLM call fails on `/ask` | HTTP 503 with error detail |
| No matching vectors found | Returns `{ "answer": "No relevant content found" }` |

---

## Known Limitations / Future Improvements

- **No hybrid search** — only semantic search via embeddings; keyword search (`ilike`) exists separately in `getContent` but is not combined
- **Re-embeds on every update** — even if content didn't change
- **No similarity threshold** — returns top 5 even if similarity is very low (irrelevant results possible)
