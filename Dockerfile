FROM anapsix/alpine-java

COPY web-resources/ .
COPY docker/gradesim.jar .

CMD java -jar gradesim.jar $PORT
