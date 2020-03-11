ALTER TABLE article ADD CONSTRAINT fk_article_uuid foreign key(article_uuid) references article_sentiment(article_uuid);


let theInsertQuery = `INSERT INTO table_name (column1, column2, column3, ...)
VALUES (value1, value2, value3, ...)`;
