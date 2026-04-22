<script lang="ts">
const shuffleMembers = (
  members: Member[],
  pinTheFirstMember = false
): void => {
  let offset = pinTheFirstMember ? 1 : 0
  // `i` is between `1` and `length - offset`
  // `j` is between `0` and `length - offset - 1`
  // `offset + i - 1` is between `offset` and `length - 1`
  // `offset + j` is between `offset` and `length - 1`
  let i = members.length - offset
  while (i > 0) {
    const j = Math.floor(Math.random() * i)
    ;[members[offset + i - 1], members[offset + j]] = [
      members[offset + j],
      members[offset + i - 1]
    ]
    i--
  }
}
</script>

<script setup lang="ts">
import { VTLink } from '@vue/theme'
import membersCoreData from './members-core.json'
import membersEmeritiData from './members-emeriti.json'
import membersPartnerData from './members-partner.json'
import TeamHero from './TeamHero.vue'
import TeamList from './TeamList.vue'
import type { Member } from './Member'
shuffleMembers(membersCoreData as Member[], true)
shuffleMembers(membersEmeritiData as Member[])
shuffleMembers(membersPartnerData as Member[])
</script>

<template>
  <div class="TeamPage">
    <TeamHero>
      <template #title>认识团队</template>
      <template #lead>
        Vue 及其生态系统的发展由一个国际化团队共同推动，其中一部分成员展示如下。
      </template>

      <template #action>
        <VTLink
          href="https://github.com/vuejs/governance/blob/master/Team-Charter.md"
        >
          了解更多团队信息
        </VTLink>
      </template>
    </TeamHero>

    <TeamList :members="(membersCoreData as Member[])">
      <template #title>核心团队成员</template>
      <template #lead>
        核心团队成员是积极参与一个或多个核心项目维护的人。他们为 Vue 生态作出了重要贡献，并长期致力于项目及其用户的成功。
      </template>
    </TeamList>

    <TeamList :members="(membersEmeritiData as Member[])">
      <template #title>核心团队荣誉成员</template>
      <template #lead>
        在这里，我们向过去作出宝贵贡献、如今已不再活跃的核心团队成员致敬。
      </template>
    </TeamList>

    <TeamList :members="(membersPartnerData as Member[])">
      <template #title>社区伙伴</template>
      <template #lead>
        Vue 社区中有一些成员为生态带来了极大的价值，值得特别提及。我们与这些重要伙伴建立了更紧密的合作关系，并经常就即将推出的功能和资讯进行协作。
      </template>
    </TeamList>
  </div>
</template>

<style scoped>
.TeamPage {
  padding-bottom: 16px;
}

@media (min-width: 768px) {
  .TeamPage {
    padding-bottom: 96px;
  }
}

.TeamList + .TeamList {
  padding-top: 64px;
}
</style>
