create table products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name varchar(100) not null,
  description varchar(500) not null,
  price decimal(10,2) not null,
  stock integer not null default 0
);

-- Enable Row Level Security
alter table products enable row level security;

-- Create policies
create policy "Enable read access for all users" on products
  for select using (true);

create policy "Enable insert for authenticated users only" on products
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on products
  for update using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on products
  for delete using (auth.role() = 'authenticated');

-- Create function to automatically update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger update_products_updated_at
  before update on products
  for each row
  execute function update_updated_at_column(); 