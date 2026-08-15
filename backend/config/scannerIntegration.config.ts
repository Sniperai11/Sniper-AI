/**
 * Scanner Integration Configuration
 * Configures all security scanners and tools
 */

export const SCANNER_INTEGRATION_CONFIG = {
  // ============ Burp Suite Configuration ============
  burpSuite: {
    enabled: process.env.BURP_SUITE_ENABLED === 'true',
    apiUrl: process.env.BURP_API_URL || 'http://localhost:8080',
    apiKey: process.env.BURP_API_KEY,
    timeout: parseInt(process.env.BURP_TIMEOUT || '60000', 10),
    profile: 'Audit everything - thorough and time-consuming',
    scanTypes: ['active', 'passive'],
    // Only scan on explicit activation (expensive operation)
    autoScan: false,
    skipInfo: true
  },

  // ============ Trivy Configuration ============
  trivy: {
    enabled: process.env.TRIVY_ENABLED === 'true',
    binary: process.env.TRIVY_BIN || 'trivy',
    timeout: parseInt(process.env.TRIVY_TIMEOUT || '120000', 10),
    severity: ['CRITICAL', 'HIGH'],
    skipUpdate: process.env.TRIVY_SKIP_UPDATE === 'true',
    offlineDb: process.env.TRIVY_OFFLINE_DB === 'true',
    scanTypes: {
      image: true,
      filesystem: true,
      repository: true,
      kubernetes: process.env.K8S_ENABLED === 'true'
    }
  },

  // ============ Nuclei Configuration ============
  nuclei: {
    enabled: process.env.NUCLEI_ENABLED !== 'false',
    binary: process.env.NUCLEI_BIN || 'nuclei',
    timeout: parseInt(process.env.NUCLEI_TIMEOUT || '60000', 10),
    templates: process.env.NUCLEI_TEMPLATES || '~/nuclei-templates',
    severity: ['critical', 'high', 'medium'],
    rateLimitPerSecond: 100,
    threads: 10,
    updateTemplates: process.env.NUCLEI_UPDATE_TEMPLATES === 'true'
  },

  // ============ Nmap Configuration ============
  nmap: {
    enabled: process.env.NMAP_ENABLED !== 'false',
    binary: process.env.NMAP_BIN || 'nmap',
    timeout: parseInt(process.env.NMAP_TIMEOUT || '30000', 10),
    profile: '-sV -sC -O', // Service version, default scripts, OS detection
    maxHosts: 256,
    portRange: '1-65535'
  },

  // ============ SQLMap Configuration ============
  sqlmap: {
    enabled: process.env.SQLMAP_ENABLED !== 'false',
    binary: process.env.SQLMAP_BIN || 'sqlmap',
    timeout: parseInt(process.env.SQLMAP_TIMEOUT || '45000', 10),
    riskLevel: 3, // 1=Safe, 2=Normal, 3=Aggressive
    testLevel: 5, // 1=Minimal, 5=Maximum
    threads: 5,
    skipUrlEncode: false
  },

  // ============ OWASP ZAP Configuration ============
  zaap: {
    enabled: process.env.ZAAP_ENABLED !== 'false',
    apiUrl: process.env.ZAAP_API_URL || 'http://localhost:8080',
    apiKey: process.env.ZAAP_API_KEY,
    timeout: parseInt(process.env.ZAAP_TIMEOUT || '90000', 10),
    scanType: 'full', // full, baseline, quick
    threadCount: 10,
    reportFormat: 'json'
  },

  // ============ Nikto Configuration ============
  nikto: {
    enabled: process.env.NIKTO_ENABLED !== 'false',
    binary: process.env.NIKTO_BIN || 'nikto',
    timeout: parseInt(process.env.NIKTO_TIMEOUT || '30000', 10),
    port: 'default',
    timeout2: 5,
    maxTime: 900
  },

  // ============ Subfinder Configuration ============
  subfinder: {
    enabled: process.env.SUBFINDER_ENABLED !== 'false',
    binary: process.env.SUBFINDER_BIN || 'subfinder',
    timeout: parseInt(process.env.SUBFINDER_TIMEOUT || '30000', 10),
    sources: 'all',
    silent: true,
    recursive: true
  },

  // ============ Amass Configuration ============
  amass: {
    enabled: process.env.AMASS_ENABLED !== 'false',
    binary: process.env.AMASS_BIN || 'amass',
    timeout: parseInt(process.env.AMASS_TIMEOUT || '60000', 10),
    enum: 'basic', // basic, active, passive
    passive: true
  },

  // ============ WhatWeb Configuration ============
  whatweb: {
    enabled: process.env.WHATWEB_ENABLED !== 'false',
    binary: process.env.WHATWEB_BIN || 'whatweb',
    timeout: parseInt(process.env.WHATWEB_TIMEOUT || '30000', 10),
    aggression: 1, // 1=Passive, 2=Aggressive, 3=Stealthy
    threadPool: 25
  },

  // ============ Global Scanner Configuration ============
  global: {
    // Concurrency settings
    maxConcurrentScanners: 5,
    maxParallelScansPer: 'target',

    // Caching
    enableCache: process.env.SCANNER_CACHE_ENABLED === 'true',
    cacheTTL: parseInt(process.env.SCANNER_CACHE_TTL || '3600', 10), // 1 hour
    cacheLocation: process.env.SCANNER_CACHE_DIR || '/tmp/sniper-ai-cache',

    // Logging
    logLevel: process.env.SCANNER_LOG_LEVEL || 'info',
    logDir: process.env.SCANNER_LOG_DIR || './logs/scanners',
    logRotation: true,
    maxLogSize: '10m',
    maxLogs: 7,

    // Retry policy
    maxRetries: 3,
    retryDelay: 1000, // ms
    retryBackoffMultiplier: 2,

    // Timeout settings
    globalTimeout: parseInt(process.env.SCANNER_GLOBAL_TIMEOUT || '600000', 10), // 10 minutes
    connectTimeout: parseInt(process.env.SCANNER_CONNECT_TIMEOUT || '10000', 10),
    readTimeout: parseInt(process.env.SCANNER_READ_TIMEOUT || '30000', 10),

    // Network settings
    userAgent: 'Sniper-AI-Security-Scanner/3.0',
    proxy: process.env.SCANNER_PROXY,
    noProxy: process.env.SCANNER_NO_PROXY,

    // Result handling
    minSeverity: 'Low', // Filter results below this severity
    deduplicateResults: true,
    normalizeResults: true,
    enrichWithAI: process.env.SCANNER_ENRICH_WITH_AI === 'true',

    // Performance
    batchSize: 50,
    resultsCaching: true,
    parallelProcessing: true
  },

  // ============ Scanner Priority & Profiles ============
  profiles: {
    // Quick scan - fast with common tools
    quick: {
      tools: ['whatweb', 'nikto', 'nuclei'],
      timeout: 60000
    },

    // Standard scan - balanced speed and comprehensiveness
    standard: {
      tools: ['nmap', 'nuclei', 'nikto', 'whatweb', 'subfinder'],
      timeout: 300000
    },

    // Deep scan - comprehensive but time-consuming
    deep: {
      tools: ['nmap', 'nuclei', 'nikto', 'zaap', 'whatweb', 'subfinder', 'amass', 'burpSuite'],
      timeout: 600000
    },

    // Mobile scan - optimized for mobile apps
    mobile: {
      tools: ['subfinder', 'nuclei', 'whatweb'],
      timeout: 300000
    },

    // API scan - optimized for API testing
    api: {
      tools: ['nuclei', 'zaap', 'nikto'],
      timeout: 300000
    },

    // Container scan - for Docker images and K8s
    container: {
      tools: ['trivy'],
      timeout: 120000
    }
  },

  // ============ Error Handling ============
  errorHandling: {
    continueOnError: true,
    logErrors: true,
    notifyOnCriticalError: true,
    fallbackMode: 'graceful' // graceful or strict
  }
};

export default SCANNER_INTEGRATION_CONFIG;
