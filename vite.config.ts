import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {        
    clearMocks: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup/testing-library.ts"],    
    coverage: {
      provider: "v8",
      reporter: ["cobertura", "html"],
      enabled: true,         
    }
  },
})