package pl.mati.uonet.backend

import pl.mati.uonet.backend.cache.InMemoryCache
import pl.mati.uonet.backend.data.JSONFinalAverage
import pl.mati.uonet.backend.data.JSONGrade
import java.util.function.Consumer

class GradeDao(val devMode: Boolean) {
    private val sdk = getSdkObject(devMode)

    private val JSONcache = InMemoryCache()

    companion object {
        const val EXPIRATION_PERIOD: Long = 15000
    }

    fun getAllAverages(): MutableList<JSONFinalAverage>? {

        val avgs = sdk.getGradesSummary(57751).blockingGet()

        val JSONavgs = mutableListOf<JSONFinalAverage>()
        avgs.forEach(Consumer { t ->
            val javg = JSONFinalAverage(t.name, t.average.toString())
            JSONavgs.add(javg)
        })
        return JSONavgs
    }

    fun getAllGrades(): MutableList<JSONGrade>? {

        if (JSONcache.exists("all")) {
            return JSONcache.get("all")
        }

        val grades1 = sdk.getGrades(57751).blockingGet()
        val grades2 = sdk.getGrades(57752).blockingGet()
        val grades = grades1 + grades2

        val JSONgrades = mutableListOf<JSONGrade>()
        grades.forEach(Consumer { t ->
            if (t.value + t.modifier == 0.0) {
                return@Consumer
            }
            val jgrade = JSONGrade(t.description, t.subject, (t.value + t.modifier).toString(), t.weight.dropLast(3))
            JSONgrades.add(jgrade)
        })
        JSONcache.add("all", JSONgrades, EXPIRATION_PERIOD)
        return JSONgrades
    }

    fun getGradesBySubject(subject: String): MutableList<JSONGrade>? {

        if (JSONcache.exists(subject)) {
            return JSONcache.get(subject)
        }

        val grades1 = sdk.getGrades(57751).blockingGet()
        val grades2 = sdk.getGrades(57752).blockingGet()
        var grades = grades1 + grades2
        grades = grades.filter { it.subject.toLowerCase().matches(Regex(subject.replace(",", "||"))) }

        val JSONgrades = mutableListOf<JSONGrade>()
        grades.forEach(Consumer { t ->
            if (t.value + t.modifier == 0.0) {
                return@Consumer
            }
            val jgrade = JSONGrade(t.description, t.subject, (t.value + t.modifier).toString(), t.weight.dropLast(3))
            JSONgrades.add(jgrade)
        })
        JSONcache.add(subject, JSONgrades, EXPIRATION_PERIOD)
        return JSONgrades
    }
}
