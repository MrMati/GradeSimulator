FROM anapsix/alpine-java

RUN ./gradlew stage

COPY web-resources/ .
COPY docker/gradesim.jar .

CMD java -jar gradesim.jar $PORT
