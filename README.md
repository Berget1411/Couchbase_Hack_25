# COUCHBASE x AWS x Cillers
### Stockholm Hackathon // July 1st, 2025

# ----[ OUR STORY ]----

## ▒▒▒ P R E L U D E ▒▒▒
SmartPyLogger was built in just under two weeks of focused execution during the June–July 2025 AWS x Couchbase x Cillers hackathon.

Before we signed up, I (Niklavs Visockis) and Jonas Lorenz,  my friend, backend/ML dev, and teammate from the KTH AI Society (AIS), had just wrapped an internal demo for Twiga AI. We’d implemented graphRAG using Neo4j, then spent hours talking. Goals, build philosophies, future paths. I told him about my previous hackathons. What worked, what didn’t. What I’d do differently. I asked if he’d join the next one.

A few days later, Couchbase hit my inbox. I shot him a message: "JOIN QUICK APPLY APPLY NOWWWWW".

But we needed one more. Two backend-heavy devs won’t cut it. I had met Ludvig Bergström when he reached out to me about a KTH Innovation event a few days prior, and it turned out that he was a JS dev. He showed me his personal website and I was blown away by the design and smoothness. With that, our team got a 3rd member. 


## ▒▒▒ I D E A ▒▒▒
People keep saying it: “Use-case over tech.”
Fine. But we love tech. So let’s build something for devs, not just another SaaS.

We wanted this tool to be ridiculously simple. Minimal UI, no fluff, and real value for Python web devs.

The core concept:
- FastAPI request logging with full history
- AI-backed analysis of requests and source (not just AI for the sake of it)
- CORS middleware functionality with IP blocking but logging of dissallowed IP addresses as well
- Censorship and flagging of requests based on keywords or patterns

The plan:
- Build a pip-installable package anyone can use instantly
- Custom backend for flagging, filtering, and blocking dangerous traffic
- Clean, intuitive UI, scope comes second to user flow
- Auth, payments, DB, logging, full product spine, no placeholders
- We treated it like a microstartup. No pre-seed, no pre-launch, no staged rollout.
It exists. It works. If someone wants to run it, they can. If not, that’s fine too.

No sales funnel. No landing page. No company.
Just working code you can fork and deploy.


## ▒▒▒ F I N I S H ▒▒▒
We shipped fast. Learned Go and TypeScript along the way.
Debated architecture choices deep into the night.

![image](https://github.com/user-attachments/assets/611ff6d3-db9a-4b42-8f8b-281707ce5cab)

Last minute we also managed to establish a backup couchbase cluster, that could load logged requests even if the primary cluster gets shut off.

It's not perfect. But it works, and it’s ours!

