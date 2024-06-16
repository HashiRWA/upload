# The base path is process.env.HOME which can be different in different os

# After adding the compiled contract before deploying it to the blockchain, it needs to be optimised.

```
 docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/rust-optimizer:0.12.11
```

# Upload Contract:

useUpload("Work/hackathons/upload/hashirwa_contracts.wasm")

# Verify Contract:

useVerifyCodeID(167)

# Instantiate Contract:

useInstantiate(167,{ "counter": 0 },"Poke Counter")
useInstantiate(167,{ "counter": 0 },"Deployed bank")

# FOR CW 20

mantra1uen40cgamn8u0k8zwfyqqzypdn36fr2vrfwh0ghawpq66je0p8zslgzxxc -->
mantra1677vsq6cs4z3hd629h44zppg3ya8y7txyaxjryud5f54lnwj09rs96npfl
mantra12yng80emt5zyptsauuravswr6hknum56vrrckvdwda25jve0zg2q2lt7wd
mantra1p2ds40jhuf7d3h0n0heseue7msyqk0evzcks2pk4344wfe8rtx3sfx09fp
Deposit Working
mantra190f353hxtswfdsux8c45wedh7wkngz2hrgphnrmfefhmh0yurmws35pd5t
Withdraw Working
mantra1pcpdl0kts7djtwwyyx5pn0xpg2t7husy3jmxxhc26tnlk7qc4rvqrgqj47
Withdraw Interest Working
mantra16dlu5xshfdem7h3hw3y6m3qgrxavwxs4wrhac2uxcewzc76qwqaq6whynk
Borrow / Loan Working
mantra16zcqaswsvp2zv29wll2jzx7j67vwlm9qvdlp372467l5h2ddaqnsrreum6
mantra1tcaj39ja6nteqfy0dr64en2tl66u8j673pdgqewmue4czf09uemsvdm5w6
mantra17wz3c00nv7kcnh09akea6qd53guyvprpmcvcghh8vzu0e2ssdr4st46q2u
mantra19pnf44x3fjg2wzw6qz29eqd3jfz0wuxl7smuz50wd4thntytnq8qhmmc34
Final Stable
mantra1zlx6dsre0pg8x7ry47f45ly6t50z87j6arx0ntnu3hdx25q46k9qwhgced
Final with diffrent userDetails and poolDetails
mantra1gcq4789r6ca4s9e8lq2f585s0qatge8p7ehlpcsjsgf3kgxushzsrq7394

Final Stable Testing Contract :
mantra15g85x8gnlm9k8cjj9vu6v97fps3g2lmjyg64p0usdxrnc082wwyqsu6q57

174, 175, 176, 177, 178
Pools :
maturity | debtI | lendI | ocf | strike |

1.  1721045677 14 7 2 2
2.  1723724077 13 6 2 3
3.  1723724077 13 6 3 3
4.  1728994477 16 7 3 2
5.  1728994477 16 7 2 2
6.  1720613677 15 6 2 2  
    174 mantra1gj4pzlcwugsan5tp492p3rqh5f7dpynvcx8ngk2uye8yvlgjsgeqx2uxe8
    175 mantra1thhh6udvmpghhh3j0k5qkjpzjvete6hjvm7zss05gh9tua79wgkqx9eelp
    176 mantra1g8yjhsthsmyflefs7wv2zw2dr5z2t5lexke85vln2wd9g9h9ckmq7hj4pt
    177 mantra173xju83s09skkzfa5geygyc5hsc77y5gneycw9uw5t00zv4alalsng70vu
    178 mantra1sjufd09aqs52frl5cvt65mqgpzfp05kqqxlawfcz2lxwl5xvcmmqkfmt4c
