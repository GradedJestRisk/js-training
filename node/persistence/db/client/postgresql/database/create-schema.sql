DROP TABLE IF EXISTS recipe;
CREATE TABLE recipe (
   name    TEXT,
   serving INTEGER,
   source  TEXT
 );

INSERT INTO recipe
   (name, serving, source)
VALUES
   ('saag-feta', 4, 'https://owiowifouettemoi.com/2019/05/08/saag-feta/')
;

INSERT INTO recipe
   (name, serving, source)
VALUES
   ('caramelized-garlic-tart', 4, 'https://www.theguardian.com/lifeandstyle/2008/mar/01/foodanddrink.shopping1')
;
