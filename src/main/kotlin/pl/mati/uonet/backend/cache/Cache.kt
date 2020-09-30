package pl.mati.uonet.backend.cache

interface Cache<T> {

    fun exists(key: String): Boolean

    fun add(key: String, value: MutableList<T>?, periodInMillis: Long)

    fun remove(key: String)

    operator fun get(key: String): MutableList<T>?

    fun clear()

    fun size(): Long
}
