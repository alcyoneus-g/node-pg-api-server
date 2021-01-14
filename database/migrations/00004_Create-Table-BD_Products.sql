CREATE TABLE IF NOT EXISTS BD_Products (
  Id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  Name VARCHAR(32),
  Picture VARCHAR(1024),
  Description TEXT,
  Price VARCHAR(8),
  Category VARCHAR (32)
)
