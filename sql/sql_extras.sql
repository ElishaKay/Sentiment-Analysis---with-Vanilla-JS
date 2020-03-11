ALTER TABLE article ADD CONSTRAINT fk_article_uuid foreign key(article_uuid) references article_sentiment(article_uuid);

