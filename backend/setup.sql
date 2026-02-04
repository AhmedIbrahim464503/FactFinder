-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store your documents
create table if not exists documents (
  id bigserial primary key,
  content text, -- corresponds to Document.page_content
  metadata jsonb, -- corresponds to Document.metadata
  embedding vector(768) -- Google Gemini embedding dimension
);

-- Create a function to search for documents
create or replace function match_documents (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Create a table to store search history
create table if not exists search_history (
  id uuid default gen_random_uuid() primary key,
  topic text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  summary text,
  graph_data jsonb
);
