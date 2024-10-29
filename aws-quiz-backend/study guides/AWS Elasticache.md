# AWS ElastiCache Study Guide

## Key Concepts and Definitions

### Basic Concepts
- ElastiCache is a managed in-memory caching service
- Supports Redis and Memcached engines
- Used to improve application performance by retrieving data from fast in-memory caches
- Reduces database load and latency

### Primary Use Cases
- Session management
- Database query caching
- Real-time analytics
- Gaming leaderboards
- Geospatial applications

## Memory Aid: CREDS
- **C**aching service for **R**edis and m**E**mcache**D**
- Improves **S**peed

## Visual Aid: Basic ElastiCache Architecture
```
[Application] ←→ [ElastiCache] ←→ [Database]
     ↑              ↑
     └──── Cache Hit (Fast)
     └──── Cache Miss (Slow, fetch from DB)
```

## Redis vs. Memcached Comparison

| Feature | Redis | Memcached |
|---------|-------|-----------|
| Multi-AZ | Yes | No |
| Replication | Yes | No |
| Backup/Restore | Yes | No |
| Data Types | Complex | Simple |
| Data Persistence | Yes | No |
| Encryption | Yes | No |
| Auto Failover | Yes | No |

## Key Processes

### Cache Update Strategies
1. Lazy Loading
   - Load data on cache miss
   - Data can become stale
   - No unnecessary cache loads

2. Write Through
   - Update cache when database is updated
   - Data always current
   - Write penalty (slower writes)

### Scaling Process
1. **Horizontal Scaling**
   - Add/remove nodes
   - Redis: Add read replicas
   - Memcached: Add nodes to cluster

2. **Vertical Scaling**
   - Change node type
   - Requires new nodes

## Common Points of Confusion

1. **Redis vs. Memcached Selection**
   - Redis: Complex data types, persistence needed
   - Memcached: Simple caching, multi-threading

2. **Cache Invalidation**
   - TTL (Time To Live) settings
   - Manual invalidation
   - Write-through vs. lazy loading

3. **Security**
   - Redis AUTH
   - Security groups
   - Encryption in-transit/at-rest

## Practice Questions

1. Which ElastiCache engine supports Multi-AZ deployments?
   - A) Memcached
   - B) Redis
   - C) Both
   - D) Neither
   *Answer: B*

2. What caching strategy loads data only when requested?
   - A) Write-through
   - B) Lazy loading
   - C) Active loading
   - D) Eager loading
   *Answer: B*

3. Which feature is NOT supported by Memcached?
   - A) Multi-threading
   - B) Data persistence
   - C) Simple data structures
   - D) Auto-discovery
   *Answer: B*

4. When should you choose Redis over Memcached?
   - A) When you need simple string caching
   - B) When you need complex data types
   - C) When you only need single-threaded performance
   - D) When you don't need persistence
   *Answer: B*

5. What is the primary purpose of ElastiCache?
   - A) Long-term data storage
   - B) Improve database performance
   - C) File system caching
   - D) Content delivery
   *Answer: B*

## Best Practices

1. Monitor memory usage
2. Use appropriate node sizes
3. Implement proper cache invalidation
4. Configure security groups correctly
5. Use parameter groups for engine configuration
6. Enable encryption for sensitive data
7. Set appropriate backup windows
8. Use tags for resource management