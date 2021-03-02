SELECT * FROM recipe;

-- Recipe + user
SELECT
    r.id,
    r.name,
    r.serving,
    u.name
FROM
    recipe r INNER JOIN "user" u ON u.id = r.user_id
;

-- Recipe + user + Ingredients
SELECT
    u.name,
    r.id,
    r.name,
    r.serving,
    ri.quantity,
    ri.unit,
    i.name
FROM
    recipe r
        INNER JOIN "user" u ON u.id = r.user_id
        INNER JOIN recipes_ingredients ri ON ri.recipe_id = r.id
        INNER JOIN ingredient i ON i.id = ri.ingredient_id
WHERE 1=1
    AND u.name = 'jack'
    AND r.name = 'bread'
;