'use strict';

/**
 * http://www.moel.go.kr/retirementpayCal.do 참조
 * 2018/5/16
 */

var moment = require('moment');

function get퇴직금({입사일, 퇴사일, 제외일수, 최근순3개월임금목록, 연상여금, 연차수당, 일일통상임금, 디버그}) {

  function 로깅(로그) {
    if (디버그) console.debug(로그);
  }

  const 재직일수 = get재직일수({입사일, 퇴사일, 제외일수});
  로깅(`재직일수 : ${재직일수}`);

  const 최근3개월임금 = get최근3개월임금({퇴사일, 최근순3개월임금목록});
  로깅(`최근3개월임금 :`);
  로깅(최근3개월임금);

  const 일일평균임금 = get일일평균임금({최근3개월임금, 연상여금, 연차수당});
  로깅(`일일평균임금 : ${일일평균임금}`);

  const 퇴직금 = (일일평균임금 > 일일통상임금 ? 일일평균임금 : 일일통상임금) * 30 * (재직일수 / 365);

  return 퇴직금;
}

function get재직일수({입사일, 퇴사일, 제외일수}) {
  const 재직일수 = moment(퇴사일).diff(입사일, 'days') - 제외일수;
  return 재직일수;
}

function get일일평균임금({최근3개월임금, 연상여금, 연차수당}) {

  const 삼개월간임금총액 = 최근3개월임금.reduce((a, c) => a + c.임금, 0);
  const 삼개월간총일수 = 최근3개월임금.reduce((a, c) => a + c.일수, 0);
  
  const 상여금가산액 = 연상여금 * 0.25;
  const 연차수당가산액 = 연차수당 * 0.25;
  const 일일평균임금 = (삼개월간임금총액 + 상여금가산액 + 연차수당가산액) / 삼개월간총일수;

  return Math.ceil((Math.round(일일평균임금 * 1000) / 1000) * 100) / 100;
}

function get최근3개월임금({퇴사일, 최근순3개월임금목록}) {

  const 최근3개월임금 = [];

  const dateWrapper = moment(퇴사일);

  for (let i = 0 ; i < 4 ; i++) {

    dateWrapper.add(-1, 'd');
    const 종료일 = dateWrapper.toDate();
    dateWrapper.date(1);

    if (i === 3)
    {
      if (퇴사일.getDate() !== 1){
        dateWrapper.date(퇴사일.getDate());
      }
      else break;
    }

    const 시작일 = dateWrapper.toDate();

    const 일수 = moment(종료일).diff(시작일, 'days') + 1;

    if (i === 3 && 퇴사일.getDate() !== 1 && 최근순3개월임금목록.length !== 4) {
      throw Error("퇴사일이 1일이 아닌 경우, 최근순3개월임금목록의 길이는 4가 되어야 하며 마지막에는 일할계산된 3개월전 임금이 입력되어야 합니다. (" + moment(시작일).format('YYYY-MM-DD')+ ' ~ ' + moment(종료일).format('YYYY-MM-DD')+ '사이의 ' + 일수 + '간의 임금)');
    }

    const 임금 = 최근순3개월임금목록[i];

    최근3개월임금.push({
      시작일, 종료일, 일수, 임금
    });
  }
  return 최근3개월임금;
}

module.exports = {
  get퇴직금,
  get재직일수,
  get일일평균임금,
  get최근3개월임금
}