CREATE TABLE company (
    company_id int(11) UNSIGNED NOT NULL auto_increment,
    company_name varchar(50) DEFAULT NULL,
    company_sector varchar(50) DEFAULT NULL,
    company_symbol varchar(50) DEFAULT NULL,
    company_creation_date timestamp NULL DEFAULT NULL,
    PRIMARY KEY (company_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table article (
    article_id int(11) NOT NULL Auto_increment primary key,
    article_uuid varchar(50) NOT NULL,
    article_title varchar(50) DEFAULT NULL,
    article_creation_date timestamp NULL DEFAULT NULL,
    foreign key(article_uuid) references article_sentiment(article_uuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


create table article_sentiment (
    article_sentiment_id int Auto_increment primary key,
    article_uuid varchar(50) NOT NULL,
    afinn_score int(11),
    sentiment_model_id int(11),
    foreign key(article_uuid) references article(article_uuid),
    foreign key(sentiment_model_id) references sentiment_model(sentiment_model_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table company_sentiment (
    company_sentiment_id int Auto_increment primary key,
    company_id int(11) NOT NULL,
    article_uuid varchar(50) NOT NULL,
    afinn_score int(11),
    sentiment_model_id int(11),
    foreign key(article_uuid) references article(article_uuid),
    foreign key(company_id) references company(company_id),
    foreign key(sentiment_model_id) references sentiment_model(sentiment_model_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table sentiment_model (
    sentiment_model_id int(11) Auto_increment primary key,
    sentiment_model_title varchar(50) NOT NULL,
    sentiment_model_description varchar(500) NOT NULL, 
    foreign key(sentiment_model_id) references company_sentiment(sentiment_model_id),
    foreign key(sentiment_model_id) references article_title_sentiment(sentiment_model_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
