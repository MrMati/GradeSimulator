package pl.mati.uonet.backend

import com.google.gson.GsonBuilder
import io.javalin.Javalin
import io.javalin.apibuilder.ApiBuilder.get
import io.javalin.plugin.json.FromJsonMapper
import io.javalin.plugin.json.JavalinJson
import io.javalin.plugin.json.ToJsonMapper
import org.eclipse.jetty.server.Server
import org.eclipse.jetty.server.ServerConnector
import java.io.File

fun main(args: Array<String>) {

    val gradeDao = GradeDao()

    val app = Javalin.create { config ->
        config.server {
            Server().apply {
                connectors = arrayOf(ServerConnector(this).apply {
                    this.host = if (System.getenv("MODE") == "DEV") "127.0.0.1" else "0.0.0.0"
                    this.port = if (args.isEmpty()) 80 else args[0].toInt()
                })
            }
        }
    }.apply {
        exception(Exception::class.java) { e, ctx -> e.printStackTrace() }
        error(404) { ctx -> ctx.html("not found") }
    }.start(80)

    val gson = GsonBuilder().create()
    JavalinJson.fromJsonMapper = object : FromJsonMapper {
        override fun <T> map(json: String, targetClass: Class<T>) = gson.fromJson(json, targetClass)
    }
    JavalinJson.toJsonMapper = object : ToJsonMapper {
        override fun map(obj: Any): String = gson.toJson(obj)
    }

    val html = File("table.html").readText()

    app.routes {

        get("/") { ctx ->
            ctx.html(html)
        }

        get("/grades") { ctx ->
            ctx.json(gradeDao.getAllGrades()!!)
        }

        get("/grades/subject/:subject-name") { ctx ->
            ctx.json(gradeDao.getGradesBySubject(ctx.pathParam("subject-name"))!!)
        }

    }
}

