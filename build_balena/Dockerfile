FROM balenalib/raspberrypi4-64-golang:latest

RUN mkdir /app
COPY server.go /app/server.go
COPY html /app/static

EXPOSE 8007
WORKDIR /app
CMD ["go", "run", "server.go"]