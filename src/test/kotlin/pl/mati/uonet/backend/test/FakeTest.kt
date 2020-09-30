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
class FakeTest {

    companion object {
        private const val EXPECTED_ALL_GRADES =
            "[{\"Nazwa\":\"Aktywność\",\"Przedmiot\":\"Zajęcia z wychowawcą\",\"Ocena\":\"3.0\",\"Waga\":\"5\"},{\"Nazwa\":\"Aktywność\",\"Przedmiot\":\"Zajęcia z wychowawcą\",\"Ocena\":\"4.0\",\"Waga\":\"5\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Język polski\",\"Ocena\":\"3.0\",\"Waga\":\"5\"},{\"Nazwa\":\"Egzamin próbny\",\"Przedmiot\":\"Język polski\",\"Ocena\":\"3.0\",\"Waga\":\"6\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Język polski\",\"Ocena\":\"4.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Język polski\",\"Ocena\":\"4.0\",\"Waga\":\"1\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Język polski\",\"Ocena\":\"2.0\",\"Waga\":\"6\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Język polski\",\"Ocena\":\"3.0\",\"Waga\":\"2\"},{\"Nazwa\":\"Kondensatory\",\"Przedmiot\":\"Fizyka\",\"Ocena\":\"1.0\",\"Waga\":\"6\"},{\"Nazwa\":\"Transformatory\",\"Przedmiot\":\"Fizyka\",\"Ocena\":\"2.0\",\"Waga\":\"5\"},{\"Nazwa\":\"Magnesy\",\"Przedmiot\":\"Fizyka\",\"Ocena\":\"3.0\",\"Waga\":\"2\"},{\"Nazwa\":\"Optyka\",\"Przedmiot\":\"Fizyka\",\"Ocena\":\"4.0\",\"Waga\":\"5\"},{\"Nazwa\":\"Praca moc energia\",\"Przedmiot\":\"Fizyka\",\"Ocena\":\"5.0\",\"Waga\":\"6\"},{\"Nazwa\":\"Stała kosmologiczna\",\"Przedmiot\":\"Fizyka\",\"Ocena\":\"6.0\",\"Waga\":\"1\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Matematyka\",\"Ocena\":\"3.0\",\"Waga\":\"1\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Matematyka\",\"Ocena\":\"5.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Biologia\",\"Ocena\":\"4.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Geografia\",\"Ocena\":\"3.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Informatyka\",\"Ocena\":\"2.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Religia\",\"Ocena\":\"1.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Religia\",\"Ocena\":\"1.0\",\"Waga\":\"3\"},{\"Nazwa\":\"Aktywność\",\"Przedmiot\":\"Zajęcia z wychowawcą\",\"Ocena\":\"3.0\",\"Waga\":\"5\"},{\"Nazwa\":\"Aktywność\",\"Przedmiot\":\"Zajęcia z wychowawcą\",\"Ocena\":\"4.0\",\"Waga\":\"5\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Język polski\",\"Ocena\":\"3.0\",\"Waga\":\"5\"},{\"Nazwa\":\"Egzamin próbny\",\"Przedmiot\":\"Język polski\",\"Ocena\":\"3.0\",\"Waga\":\"6\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Język polski\",\"Ocena\":\"4.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Język polski\",\"Ocena\":\"4.0\",\"Waga\":\"1\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Język polski\",\"Ocena\":\"2.0\",\"Waga\":\"6\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Język polski\",\"Ocena\":\"3.0\",\"Waga\":\"2\"},{\"Nazwa\":\"Kondensatory\",\"Przedmiot\":\"Fizyka\",\"Ocena\":\"1.0\",\"Waga\":\"6\"},{\"Nazwa\":\"Transformatory\",\"Przedmiot\":\"Fizyka\",\"Ocena\":\"2.0\",\"Waga\":\"5\"},{\"Nazwa\":\"Magnesy\",\"Przedmiot\":\"Fizyka\",\"Ocena\":\"3.0\",\"Waga\":\"2\"},{\"Nazwa\":\"Optyka\",\"Przedmiot\":\"Fizyka\",\"Ocena\":\"4.0\",\"Waga\":\"5\"},{\"Nazwa\":\"Praca moc energia\",\"Przedmiot\":\"Fizyka\",\"Ocena\":\"5.0\",\"Waga\":\"6\"},{\"Nazwa\":\"Stała kosmologiczna\",\"Przedmiot\":\"Fizyka\",\"Ocena\":\"6.0\",\"Waga\":\"1\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Matematyka\",\"Ocena\":\"3.0\",\"Waga\":\"1\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Matematyka\",\"Ocena\":\"5.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Biologia\",\"Ocena\":\"4.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Geografia\",\"Ocena\":\"3.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Informatyka\",\"Ocena\":\"2.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Religia\",\"Ocena\":\"1.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Religia\",\"Ocena\":\"1.0\",\"Waga\":\"3\"}]"
        private const val EXPECTED_MATH_GRADES =
            "[{\"Nazwa\":\"\",\"Przedmiot\":\"Matematyka\",\"Ocena\":\"3.0\",\"Waga\":\"1\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Matematyka\",\"Ocena\":\"5.0\",\"Waga\":\"3\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Matematyka\",\"Ocena\":\"3.0\",\"Waga\":\"1\"},{\"Nazwa\":\"\",\"Przedmiot\":\"Matematyka\",\"Ocena\":\"5.0\",\"Waga\":\"3\"}]"
    }

    private val app = GradeSimulatorApp(true)
    val gson = GsonBuilder().create()

    @Test
    fun getAllGradesTest() {
        app.start(arrayOf("8080", "127.0.0.1"))
        val response: HttpResponse<String> = Unirest.get("http://localhost:8080/grades").asString()
        assertThat(response.status).isEqualTo(200)
        print(response.body)
        assertThat(response.body).isEqualTo(EXPECTED_ALL_GRADES)
        assertThat(gson.fromJson(response.body, Array<JSONGrade>::class.java)).isEqualTo(gson.fromJson(EXPECTED_ALL_GRADES, Array<JSONGrade>::class.java))
        app.stop()
    }

    @Test
    fun getGradesBySubjectTest() {
        app.start(arrayOf("8080", "127.0.0.1"))
        val response: HttpResponse<String> = Unirest.get("http://localhost:8080/grades?filter=matematyka").asString()
        assertThat(response.status).isEqualTo(200)
        print(response.body)
        assertThat(response.body).isEqualTo(EXPECTED_MATH_GRADES)
        assertThat(gson.fromJson(response.body, Array<JSONGrade>::class.java)).isEqualTo(gson.fromJson(EXPECTED_MATH_GRADES, Array<JSONGrade>::class.java))
        app.stop()
    }
}
