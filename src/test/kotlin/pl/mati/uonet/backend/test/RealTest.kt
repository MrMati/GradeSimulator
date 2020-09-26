package pl.mati.uonet.backend.test

import com.google.gson.GsonBuilder
import kong.unirest.HttpResponse
import kong.unirest.Unirest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import pl.mati.uonet.backend.GradeSimulatorApp

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class RealTest {


    private val app = GradeSimulatorApp(false)
    val gson = GsonBuilder().create()

    @Test
    fun checkStatusTest() {
        app.start(arrayOf("8080", "127.0.0.1"))
        val response: HttpResponse<String> = Unirest.get("http://localhost:8080/grades").asString()
        assertThat(response.status).isEqualTo(200)
        app.stop()
    }
}
