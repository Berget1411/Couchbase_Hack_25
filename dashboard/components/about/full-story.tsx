"use client";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { StorySection } from "./story-section";

interface FullStoryProps {
  onBack: () => void;
}

export function FullStory({ onBack }: FullStoryProps) {
  return (
    <motion.div
      key='fullstory'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className='h-full overflow-y-auto'
    >
      <div className='text-sm text-gray-400 mb-4 flex items-center gap-2'>
        <Button
          variant='ghost'
          size='sm'
          onClick={onBack}
          className='p-1 h-auto text-gray-400 hover:text-white'
        >
          <ArrowLeft className='w-4 h-4' />
        </Button>
        Stockholm Hackathon // July 1st, 2025
      </div>

      <h2 className='text-2xl font-bold mb-6'>The Complete Story</h2>

      <div className='space-y-6 text-sm'>
        <StorySection title='PRELUDE'>
          <p className='text-gray-400 leading-relaxed mb-4'>
            SmartPyLogger was built in just under two weeks of focused execution
            during the June–July 2025 AWS x Couchbase x Cillers hackathon.
          </p>
          <p className='text-gray-400 leading-relaxed mb-4'>
            Before we signed up, I (Niklavs Visockis) and Jonas Lorenz — my
            friend, backend/ML dev, and teammate from the KTH AI Society (AIS) —
            had just wrapped an internal demo for Twiga AI. We&apos;d
            implemented graphRAG using Neo4j, then spent hours talking. Goals,
            build philosophies, future paths. I told him about my previous
            hackathons. What worked, what didn&apos;t. What I&apos;d do
            differently. I asked if he&apos;d join the next one.
          </p>
          <p className='text-gray-400 leading-relaxed mb-4'>
            A few days later, Couchbase hit my inbox. I shot him a message:
            &quot;JOIN QUICK APPLY APPLY NOWWWWW&quot;.
          </p>
          <p className='text-gray-400 leading-relaxed'>
            But we needed one more. Two backend-heavy devs won&apos;t cut it. I
            had met Ludvig Bergström when he reached out to me about a KTH
            Innovation event a few days prior, and it turned out that he was a
            JS dev. He showed me his personal website and I was blown away by
            the design and smoothness. With that, our team got a 3rd member.
          </p>
        </StorySection>

        <Separator className='my-6' />

        <StorySection title='IDEA'>
          <p className='text-gray-400 leading-relaxed mb-4'>
            People keep saying it: &quot;Use-case over tech.&quot; Fine. But we
            love tech. So let&apos;s build something for devs, not just another
            SaaS.
          </p>
          <p className='text-gray-400 leading-relaxed mb-4'>
            We wanted this tool to be ridiculously simple. Minimal UI, no fluff,
            and real value for Python web devs.
          </p>

          <div className='mb-4'>
            <p className='text-gray-300 font-medium mb-2'>The core concept:</p>
            <ul className='text-gray-400 space-y-1 ml-4'>
              <li>• FastAPI request logging with full history</li>
              <li>
                • AI-backed analysis of requests and source (not just AI for the
                sake of it)
              </li>
              <li>
                • CORS middleware functionality with IP blocking but logging of
                disallowed IP addresses as well
              </li>
              <li>
                • Censorship and flagging of requests based on keywords or
                patterns
              </li>
            </ul>
          </div>

          <div>
            <p className='text-gray-300 font-medium mb-2'>The plan:</p>
            <ul className='text-gray-400 space-y-1 ml-4 mb-4'>
              <li>
                • Build a pip-installable package anyone can use instantly
              </li>
              <li>
                • Custom backend for flagging, filtering, and blocking dangerous
                traffic
              </li>
              <li>• Clean, intuitive UI, scope comes second to user flow</li>
              <li>
                • Auth, payments, DB, logging, full product spine, no
                placeholders
              </li>
            </ul>
            <p className='text-gray-400 leading-relaxed mb-4'>
              We treated it like a microstartup. No pre-seed, no pre-launch, no
              staged rollout. It exists. It works. If someone wants to run it,
              they can. If not, that&apos;s fine too.
            </p>
            <p className='text-gray-400 leading-relaxed'>
              No sales funnel. No landing page. No company. Just working code
              you can fork and deploy.
            </p>
          </div>
        </StorySection>

        <Separator className='my-6' />

        <StorySection title='FINISH'>
          <p className='text-gray-400 leading-relaxed mb-4'>
            We shipped fast. Learned Go and TypeScript along the way. Debated
            architecture choices deep into the night.
          </p>
          <p className='text-gray-400 leading-relaxed'>
            It&apos;s not perfect. But it works, and it&apos;s ours!
          </p>
        </StorySection>
      </div>
    </motion.div>
  );
}
