#!/bin/bash

service postgresql start
psql -U postgres -c "CREATE DATABASE network_node_db;"
psql network_node_db postgres < initTables.sql
echo "table 'nodes' created successfully"

exit
