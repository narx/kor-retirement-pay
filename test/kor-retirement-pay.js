'use strict';

var expect = require('chai').expect;
var 퇴직금 = require('../index').퇴직금;

describe('퇴직금 테스트', function(){
    
    const param = {
      입사일: new Date(2017,0, 15), 
      퇴사일: new Date(2018,4,14), 
      제외일수: 0, 
      최근순3개월임금목록: [101000, 202000, 202000, 101000], 
      연상여금: 1000000, 
      연차수당: 100000, 
      일일통상임금: 0,
      디버그: true
    }

    const expected = 393785.58;

    const actual = 퇴직금.get퇴직금(param);

    it(`퇴직금 계산결과는 ${actual}원 입니다.`, function(){
        expect(actual).to.equal(expected);
    });
})
