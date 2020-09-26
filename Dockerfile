FROM gradle:jdk8

COPY ./ ./

RUN chmod +x gradlew
RUN ./gradlew stage
RUN pwd

FROM anapsix/alpine-java

COPY --from=0 /home/gradle/build/libs/gradesim.jar gradesim.jar
COPY --from=0 /home/gradle/web-resources/* /web-resources/

CMD java -jar gradesim.jar $PORT
