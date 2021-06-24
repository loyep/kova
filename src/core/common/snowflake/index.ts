export class SnowFlake {
    private readonly epoch = 1609430400000n
  
    private readonly workerIdBits: bigint = 5n // 标识ID
    private readonly dataCenterIdBits: bigint = 5n // 机器ID
    private readonly sequenceBits: bigint = 12n // 序列ID
  
    private readonly maxWorkerId: bigint = -1n ^ (-1n << this.workerIdBits)
    private readonly maxDataCenterId: bigint = -1n ^ (-1n << this.dataCenterIdBits)
    private readonly sequenceMask: bigint = -1n ^ (-1n << this.sequenceBits)
  
    private readonly workerIdShift: bigint = this.sequenceBits
    private readonly timestampLeftShift: bigint = this.dataCenterIdBits + this.sequenceBits
  
    private readonly workerId: bigint
    // private readonly dataCenterId: bigint
  
    // 控制生成的密度
    private readonly minUnitMilliseconds = 1n
  
    /** 上次生成ID的时间戳 (秒) */
    private lastTimestamp = -1n
  
    /** 当前秒内序列 (2^16)*/
    private sequence = 0n
  
    constructor(workerId = 0n, dataCenterId = 0n) {
      if (workerId > this.maxWorkerId || workerId < 0n) {
        throw new Error(`workerId can't be greater than ${this.maxWorkerId} or less than 0`)
      }
      if (dataCenterId > this.maxDataCenterId || dataCenterId < 0n) {
        throw new Error(`dataCenterId can't be greater than ${this.maxDataCenterId} or less than 0`)
      }
      this.workerId = workerId
    //   this.dataCenterId = dataCenterId
      return this
    }
  
    nextId(radix = 16): string {
      let timestamp = SnowFlake.currentLinuxTime()
      const diff = (timestamp - this.lastTimestamp) / this.minUnitMilliseconds
  
      if (diff < 0n) {
        throw new Error(`Clock moved backwards. Refusing to generate id for ${-diff} milliseconds`)
      }
  
      if (diff === 0n) {
        this.sequence = (this.sequence + 1n) & this.sequenceMask
        if (this.sequence == 0n) {
          timestamp = SnowFlake.tilNextMillis(this.lastTimestamp)
        }
      } else {
        this.sequence = 0n
      }
  
      this.lastTimestamp = timestamp
      const offset = (timestamp - this.epoch) / this.minUnitMilliseconds
  
      // 调整生成速度
      const id =
        (offset << this.timestampLeftShift) | (this.workerId << this.workerIdShift) | this.sequence
      return id.toString(radix)
    }
  
    private static tilNextMillis(lastTimeStamp: bigint) {
      let timestamp: bigint = SnowFlake.currentLinuxTime()
      while (timestamp <= lastTimeStamp) {
        timestamp = SnowFlake.currentLinuxTime()
      }
      return timestamp
    }
  
    private static currentLinuxTime(): bigint {
      return BigInt(new Date().valueOf())
    }
  }
  