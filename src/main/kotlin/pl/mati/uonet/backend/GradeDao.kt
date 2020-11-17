package pl.mati.uonet.backend

import pl.mati.uonet.backend.cache.InMemoryCache
import pl.mati.uonet.backend.data.JSONFinalAverage
import pl.mati.uonet.backend.data.JSONGrade
import java.util.function.Consumer

class GradeDao(devMode: Boolean) {
    private val sdk = getSdkObject(devMode)

    private val gradeCache = InMemoryCache<JSONGrade>()
    private val avgCache = InMemoryCache<JSONFinalAverage>()

    companion object {
        const val EXPIRATION_PERIOD: Long = 60 //seconds
    }

    fun getAllAverages(): MutableList<JSONFinalAverage>? {

        if (avgCache.exists("avg")) {
            return avgCache["avg"]
        }

        val avgs = sdk.getGradesSummary(57751).blockingGet()

        val JSONavgs = mutableListOf<JSONFinalAverage>()
        avgs.forEach(Consumer { t ->
            val javg = JSONFinalAverage(t.name, t.average.toString())
            JSONavgs.add(javg)
        })
        avgCache.add("avg", JSONavgs, EXPIRATION_PERIOD)
        return JSONavgs
    }

    fun getAllGrades(query: String?): List<JSONGrade> {

        var JSONgrades = mutableListOf<JSONGrade>()

        if (gradeCache.exists("all")) {
            JSONgrades = gradeCache["all"]!!
        } else {
            val grades1 = sdk.getGrades(57751).blockingGet()
            val grades2 = sdk.getGrades(57752).blockingGet()
            val grades = (grades1 + grades2).toMutableList()

            grades.forEach(Consumer { t ->
                if (t.value + t.modifier == 0.0) {
                    return@Consumer
                }
                var weight = t.weight.dropLast(3)
                if (t.value + t.modifier < 1) {
                    weight = "0"
                }
                val jgrade = JSONGrade(t.description, t.subject, (t.value + t.modifier).toString(), weight)
                JSONgrades.add(jgrade)
            })
            gradeCache.add("all", JSONgrades, EXPIRATION_PERIOD)
        }

        return if (query.isNullOrEmpty()) {
            JSONgrades
        } else {
            JSONgrades.filter { it.Przedmiot.toLowerCase().matches(Regex(query.replace(",", "||"))) }
        }
    }

    fun clearCache() {
        gradeCache.clear()
    }
}
