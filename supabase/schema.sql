-- =========================================
-- Monthly Planner schema
-- =========================================

create table public.pockets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name        text not null check (char_length(trim(name)) > 0),
  allocated   bigint not null default 0 check (allocated >= 0),
  color       text not null default '#10b981',
  archived    boolean not null default false,
  created_at  timestamptz not null default now()
);

create table public.transactions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null default auth.uid() references auth.users(id) on delete cascade,
  type            text not null check (type in ('income', 'expense', 'transfer')),
  amount          bigint not null check (amount > 0),
  pocket_id       uuid references public.pockets(id) on delete restrict,
  from_pocket_id  uuid references public.pockets(id) on delete restrict,
  to_pocket_id    uuid references public.pockets(id) on delete restrict,
  note            text not null default '',
  date            date not null default current_date,
  created_at      timestamptz not null default now(),

  -- pastikan kolom pocket sesuai tipe transaksi
  constraint tx_shape check (
    (type = 'income'   and pocket_id is null     and from_pocket_id is null     and to_pocket_id is null) or
    (type = 'expense'  and pocket_id is not null and from_pocket_id is null     and to_pocket_id is null) or
    (type = 'transfer' and pocket_id is null     and from_pocket_id is not null and to_pocket_id is not null
                       and from_pocket_id <> to_pocket_id)
  )
);

create index pockets_user_idx on public.pockets (user_id);
create index tx_user_date_idx on public.transactions (user_id, date desc);
create index tx_pocket_idx on public.transactions (pocket_id);

-- =========================================
-- Row Level Security
-- =========================================

alter table public.pockets enable row level security;
alter table public.transactions enable row level security;

create policy "pockets: owner only"
  on public.pockets
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- with check tambahan: pocket yang dirujuk harus milik user yang sama
create policy "transactions: owner only"
  on public.transactions
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and (pocket_id is null or exists (
      select 1 from public.pockets p where p.id = pocket_id and p.user_id = (select auth.uid())))
    and (from_pocket_id is null or exists (
      select 1 from public.pockets p where p.id = from_pocket_id and p.user_id = (select auth.uid())))
    and (to_pocket_id is null or exists (
      select 1 from public.pockets p where p.id = to_pocket_id and p.user_id = (select auth.uid())))
  );