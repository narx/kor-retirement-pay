export class 퇴직금Parameter {
  입사일: Date;
  퇴사일: Date;
  제외일수: number;
  최근순3개월임금목록: Array<number>;
  연상여금: number;
  연차수당: number;
  일일통상임금: number;
  디버그?: boolean;
}

export class 재직일수Parameter {
  입사일: Date;
  퇴사일: Date;
  제외일수: number;
}

export class 최근임금Result {
  시작일: Date;
  종료일: Date;
  일수: number;
  임금: number;
}

export class 최근3개월임금Parameter {
  퇴사일: Date;
  최근순3개월임금목록: Array<number>
}

export class 일일평균임금Parameter {
  최근3개월임금: Array<최근임금Result>;
  연상여금: number;
  연차수당: number;
}

export namespace 퇴직금 {
  export function get퇴직금(param: 퇴직금Parameter): number;
  export function get재직일수(param: 재직일수Parameter): number;
  export function get최근3개월임금(param: 최근3개월임금Parameter): Array<최근임금Result>;
  export function get일일평균임금(param: 일일평균임금Parameter): number;
}