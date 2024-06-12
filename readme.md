# The base path is process.env.HOME which can be different in different os

# After adding the compiled contract before deploying it to the blockchain, it needs to be optimised.

```
 docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/rust-optimizer:0.12.11
```

# Upload Contract:

useUpload("Work/hackathons/upload/hongbai_oracle_sample.wasm")

# Verify Contract:

useVerifyCodeID(121)

# Instantiate Contract:
useInstantiate(121,{ "counter": 0 },"Poke Counter")


# FOR CW 20
