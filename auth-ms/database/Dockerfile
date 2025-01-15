# Use an official PostgreSQL image
FROM postgres:latest

# Set environment variables
ENV POSTGRES_DB=auth
ENV POSTGRES_USER=picturas
ENV POSTGRES_PASSWORD=picturas


# Copy the SQL script to initialize the database
COPY init.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432
