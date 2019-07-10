CREATE TABLE nodes (
        id SERIAL PRIMARY KEY,
        latitude REAL,
        longitude REAL,
        altitude REAL
    );
CREATE FUNCTION node_notify() RETURNS trigger AS $node_notify$
BEGIN
    PERFORM pg_notify('watchers', row_to_json(NEW)::text );
    RETURN NEW;
END;
$node_notify$ LANGUAGE plpgsql;

CREATE TRIGGER node_notify
AFTER UPDATE ON nodes
    FOR EACH ROW EXECUTE PROCEDURE node_notify();