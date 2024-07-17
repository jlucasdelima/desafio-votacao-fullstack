FROM maven AS build

WORKDIR /app

COPY pom.xml ./
COPY src ./src

RUN mvn package -DskipTests

FROM openjdk:21

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 3333

ENTRYPOINT ["java", "-jar", "-Dserver.port=3333", "app.jar"]