FROM openjdk:21

WORKDIR /app
COPY . /app

RUN ./mvnw package -DskipTests

ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

EXPOSE 3333

ENTRYPOINT ["java", "-jar", "-Dserver.port=3333", "/app/app.jar"]