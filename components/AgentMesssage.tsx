export default function AgentMessage(
  { agentMessage }: { agentMessage: string },
) {
  return <p class="text-brain-text pb-3 whitespace-pre-wrap">{agentMessage}</p>;
}
