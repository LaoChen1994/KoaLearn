-- Create a new table called 'TableName' in schema 'SchemaName'
-- Drop the table if it already exists
DROP TABLE IF EXISTS KOA_USER_INFO

-- Create the table in the specified schema
CREATE TABLE KOA_USER_INFO
(
  USERID INT NOT NULL PRIMARY KEY,
  -- primary key column
  PASSWORD VARCHAR(255) NOT NULL,
  EMAIL VARCHAR(255) NOT NULL,
  USERNAME VARCHAR(255) NOT NULL
  -- specify more columns here
);

INSERT INTO KOA_USER_INFO
  (USERNAME, PASSWORD, EMAIL)
VALUES('testCyx', '19941116', '735849467@qq.com')
