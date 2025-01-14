# Use the official PostgreSQL image as the base image
FROM postgres:latest

# Set environment variables for the default database, user, and password
ENV POSTGRES_DB=projects
ENV POSTGRES_USER=picturas
ENV POSTGRES_PASSWORD=picturas

# Copy the schema SQL file into the container
COPY init.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432
