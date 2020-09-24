package pl.mati.uonet.backend.cache

import pl.mati.uonet.backend.data.JSONGrade

interface Cache {

    fun exists(key: String): Boolean

    fun add(key: String, value: MutableList<JSONGrade>?, periodInMillis: Long)

    fun remove(key: String)

    operator fun get(key: String): MutableList<JSONGrade>?

    fun clear()

    fun size(): Long
}
