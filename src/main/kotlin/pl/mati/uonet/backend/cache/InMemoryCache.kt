package pl.mati.uonet.backend.cache

import java.lang.ref.SoftReference
import java.util.Optional
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.DelayQueue
import java.util.concurrent.Delayed
import java.util.concurrent.TimeUnit

class InMemoryCache<T> : Cache<T> {

    private val cache = ConcurrentHashMap<String, SoftReference<MutableList<T>?>>()
    private val cleaningUpQueue = DelayQueue<DelayedCacheObject<T>>()

    init {
        val cleanerThread = Thread {
            while (!Thread.currentThread().isInterrupted) {
                try {
                    val delayedCacheObject = cleaningUpQueue.take()
                    cache.remove(delayedCacheObject.key, delayedCacheObject.reference)
                } catch (e: InterruptedException) {
                    Thread.currentThread().interrupt()
                }
            }
        }
        cleanerThread.isDaemon = true
        cleanerThread.start()
    }

    override fun exists(key: String): Boolean {

        return cache.containsKey(key)
    }

    override fun add(key: String, value: MutableList<T>?, periodInSeconds: Long) {
        val expiryTime = System.currentTimeMillis() + periodInSeconds * 1000
        val reference = SoftReference(value)
        cache[key] = reference
        cleaningUpQueue.put(DelayedCacheObject(key, reference, expiryTime))
    }

    override fun remove(key: String) {
        cache.remove(key)
    }

    override fun get(key: String): MutableList<T>? {
        return Optional.ofNullable(cache[key]).map { sRef -> sRef.get() }.orElse(null)
    }

    override fun clear() {
        cache.clear()
    }

    override fun size(): Long {
        return cache.size.toLong()
    }

    private class DelayedCacheObject<T> internal constructor(internal val key: String, val reference: SoftReference<MutableList<T>?>, private val expiryTime: Long) :
        Delayed {

        override fun getDelay(unit: TimeUnit): Long {
            return unit.convert(expiryTime - System.currentTimeMillis(), TimeUnit.MILLISECONDS)
        }

        override fun compareTo(other: Delayed): Int {
            return if (expiryTime < (other as DelayedCacheObject<*>).expiryTime) -1 else if (expiryTime > other.expiryTime) 1 else 0
        }
    }
}
