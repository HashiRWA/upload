# The base path is process.env.HOME which can be different in different os

# Upload Contract:  
useUpload("Downloads/HashiRWA/contracts/hongbai_oracle_sample.wasm")

# Verify Contract: 
useVerifyCodeID(121)

# Instantiate Contract: 
useInstantiate(121,{ "counter": 0 },"Poke Counter")