package pl.mati.uonet.backend.test

import com.google.gson.GsonBuilder
import kong.unirest.HttpResponse
import kong.unirest.Unirest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import pl.mati.uonet.backend.GradeSimulatorApp
import pl.mati.uonet.backend.data.JSONGrade

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class TestTest {

    companion object {
        private const val EXPECTED_ALL_GRADES =
            "[{\"Nazwa\":\"Aktywność\",\"Ocena\":\"3.0\",\"Waga\":\"5\"},{\"Nazwa\":\"Aktywność\",\"Ocena\":\"4.0\",\"Waga\":\"5\"},{\"Nazwa\":\"\",\"Ocena\":\"3.0\",\"Waga\":\"5\"},{\"Nazwa\":\"Egzamin próbny\",\"Ocena\":\"3.0\",\"Waga\":\"6\"},{\"Nazwa\":\"\",\"Ocena\":\"4.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Ocena\":\"4.0\",\"Waga\":\"1\"},{\"Nazwa\":\"\",\"Ocena\":\"2.0\",\"Waga\":\"6\"},{\"Nazwa\":\"\",\"Ocena\":\"3.0\",\"Waga\":\"2\"},{\"Nazwa\":\"Kondensatory\",\"Ocena\":\"1.0\",\"Waga\":\"6\"},{\"Nazwa\":\"Transformatory\",\"Ocena\":\"2.0\",\"Waga\":\"5\"},{\"Nazwa\":\"Magnesy\",\"Ocena\":\"3.0\",\"Waga\":\"2\"},{\"Nazwa\":\"Optyka\",\"Ocena\":\"4.0\",\"Waga\":\"5\"},{\"Nazwa\":\"Praca moc energia\",\"Ocena\":\"5.0\",\"Waga\":\"6\"},{\"Nazwa\":\"Stała kosmologiczna\",\"Ocena\":\"6.0\",\"Waga\":\"1\"},{\"Nazwa\":\"\",\"Ocena\":\"3.0\",\"Waga\":\"1\"},{\"Nazwa\":\"\",\"Ocena\":\"5.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Ocena\":\"4.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Ocena\":\"3.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Ocena\":\"2.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Ocena\":\"1.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Ocena\":\"1.0\",\"Waga\":\"3\"},{\"Nazwa\":\"Aktywność\",\"Ocena\":\"3.0\",\"Waga\":\"5\"},{\"Nazwa\":\"Aktywność\",\"Ocena\":\"4.0\",\"Waga\":\"5\"},{\"Nazwa\":\"\",\"Ocena\":\"3.0\",\"Waga\":\"5\"},{\"Nazwa\":\"Egzamin próbny\",\"Ocena\":\"3.0\",\"Waga\":\"6\"},{\"Nazwa\":\"\",\"Ocena\":\"4.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Ocena\":\"4.0\",\"Waga\":\"1\"},{\"Nazwa\":\"\",\"Ocena\":\"2.0\",\"Waga\":\"6\"},{\"Nazwa\":\"\",\"Ocena\":\"3.0\",\"Waga\":\"2\"},{\"Nazwa\":\"Kondensatory\",\"Ocena\":\"1.0\",\"Waga\":\"6\"},{\"Nazwa\":\"Transformatory\",\"Ocena\":\"2.0\",\"Waga\":\"5\"},{\"Nazwa\":\"Magnesy\",\"Ocena\":\"3.0\",\"Waga\":\"2\"},{\"Nazwa\":\"Optyka\",\"Ocena\":\"4.0\",\"Waga\":\"5\"},{\"Nazwa\":\"Praca moc energia\",\"Ocena\":\"5.0\",\"Waga\":\"6\"},{\"Nazwa\":\"Stała kosmologiczna\",\"Ocena\":\"6.0\",\"Waga\":\"1\"},{\"Nazwa\":\"\",\"Ocena\":\"3.0\",\"Waga\":\"1\"},{\"Nazwa\":\"\",\"Ocena\":\"5.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Ocena\":\"4.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Ocena\":\"3.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Ocena\":\"2.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Ocena\":\"1.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Ocena\":\"1.0\",\"Waga\":\"3\"}]"
    }

    private val app = GradeSimulatorApp(true)
    val gson = GsonBuilder().create()

    @Test
    fun getAllGradesTest() {
        app.start(arrayOf("8080", "127.0.0.1"))
        val response: HttpResponse<String> = Unirest.get("http://localhost:8080/grades").asString()
        assertThat(response.status).isEqualTo(200)
        assertThat(gson.fromJson(response.body, Array<JSONGrade>::class.java)).isEqualTo(gson.fromJson(EXPECTED_ALL_GRADES, Array<JSONGrade>::class.java))
        app.stop()
    }
}
