export interface ManualStep {
    title: string;
    description: string;
  }
  
  const manualSteps: ManualStep[] = [
    { title: 'How to Play', description: 'Hack This Out에 대한 소개와 게임 규칙 및 모드를 설명합니다. 더 자세한 설명은 유튜브 영상을 참고하세요.' },
    { title: 'LeaderBoard', description: '전체 사용자의 랭킹을 표시하며 순위의 기준은 경험치입니다.' },
    { title: 'Contests', description: '컨테스트를 생성하고 참여할 수 있습니다.' },
    { title: 'Machines', description: '머신을 생성하고 플레이할 수 있습니다. 머신은 항상 관리자의 승인을 받고 동작합니다.' },
  ];
  
  export default manualSteps;
  