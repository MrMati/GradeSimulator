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

class GradeSimulatorApp(val devMode: Boolean) {

    val gradeDao = GradeDao(devMode)
    lateinit var app: Javalin

    fun start() {
        start(emptyArray())
    }

    fun start(args: Array<String>): Javalin? {
        //val meterRegistry = PrometheusMeterRegistry(PrometheusConfig.DEFAULT)

        app = Javalin.create { config ->
            //config.registerPlugin(MicrometerPlugin(meterRegistry))
            config.server {
                Server().apply {
                    connectors = arrayOf(ServerConnector(this).apply {
                        this.host = if (devMode) "127.0.0.1" else "0.0.0.0"
                        this.port = if (args.isEmpty()) 80 else args[0].toInt()
                    })
                }
            }
        }.apply {
            exception(Exception::class.java) { e, _ -> e.printStackTrace() }
            error(404) { ctx -> ctx.html("not found") }
        }.start()

        /*app.exception(IllegalArgumentException::class.java) { e: IllegalArgumentException, ctx: Context? ->
            MicrometerPlugin.EXCEPTION_HANDLER.handle(e, ctx!!)
            e.printStackTrace()
        }*/

        val gson = GsonBuilder().create()
        JavalinJson.fromJsonMapper = object : FromJsonMapper {
            override fun <T> map(json: String, targetClass: Class<T>) = gson.fromJson(json, targetClass)
        }
        JavalinJson.toJsonMapper = object : ToJsonMapper {
            override fun map(obj: Any): String = gson.toJson(obj)
        }

        val html = File("web-resources/table.html").readText()
        val css = File("web-resources/style.css").readText()
        val js = File("web-resources/script.js").readText()
        val js2 = File("web-resources/script2.js").readText()

        app.routes {

            get("/") { ctx ->
                ctx.html(html)
            }

            get("/style.css") { ctx ->
                ctx.result(css).contentType("text/css")
            }

            get("/script.js") { ctx ->
                ctx.result(js).contentType("application/javascript")
            }

            get("/script2.js") { ctx ->
                ctx.result(js2).contentType("application/javascript")
            }

            get("/grades") { ctx ->
                ctx.json(gradeDao.getAllGrades(ctx.queryParam("filter"))) // .header("Server", "")
            }

            get("/grades/final") { ctx ->
                ctx.json(gradeDao.getAllAverages()!!)
            }

            get("/grades/reload") { ctx ->
                gradeDao.clearCache()
            }

            /*get("/prometheus") { ctx ->
                ctx.contentType("text/plain").result(meterRegistry.scrape())
            }*/
        }

        return app
    }

    fun stop() {
        app.stop()
    }
}

fun main(args: Array<String>) {
    val gradeSimApp = GradeSimulatorApp(false)

    gradeSimApp.start(args)
}
