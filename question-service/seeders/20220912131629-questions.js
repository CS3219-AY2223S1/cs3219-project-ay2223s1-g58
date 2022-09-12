'use strict';
 
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Questions', [{
      name: 'Two Sum',
      content: '## Description\n\nRelated Topics: [Array], [Hash Table]\n\nGiven an array of integers `nums` and an integer `target`, return _indices of the two numbers such that they add up to `target`_.\n\nYou may assume that each input would have **_exactly_ one solution**, and you may not use the _same_ element twice.\n\nYou can return the answer in any order.\n\n**Example 1:**\n\n```\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n```\n\n**Example 2:**\n\n```\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\n```\n\n**Example 3:**\n\n```\nInput: nums = [3,3], target = 6\nOutput: [0,1]\n```\n\n**Constraints:**\n\n*   2 <= nums.length <= 10<sup>4</sup>\n*   -10<sup>9</sup> <= nums[i] <= 10<sup>9</sup>\n*   -10<sup>9</sup> <= target <= 10<sup>9</sup>\n*   **Only one valid answer exists.**\n\n**Follow-up:** Can you come up with an algorithm that is less than O(n<sup>2</sup>) time complexity?\n',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Palindrome Numebr',
      content: '## Description\n\nRelated Topics: [Math]\n\nGiven an integer `x`, return `true` if `x` is palindrome integer.\n\n An integer is a **palindrome** when it reads the same backward as forward.\n\n*   For example, `121` is a palindrome while `123` is not.\n\n**Example 1:**\n\n```\nInput: x = 121\nOutput: true\nExplanation: 121 reads as 121 from left to right and from right to left.\n```\n\n**Example 2:**\n\n```\nInput: x = -121\nOutput: false\nExplanation: From left to right, it reads -121\\. From right to left, it becomes 121-. Therefore it is not a palindrome.\n```\n\n**Example 3:**\n\n```\nInput: x = 10\nOutput: false\nExplanation: Reads 01 from right to left. Therefore it is not a palindrome.\n```\n\n**Constraints:**\n\n*   -2<sup>31</sup> <= x <= 2<sup>31</sup> - 1\n\n**Follow up:** Could you solve it without converting the integer to a string?\n\n\n```',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Reverse Integer',
      content: '## Description\n\nRelated Topics: [Math]\n\n\nGiven a signed 32-bit integer `x`, return `x` _with its digits reversed_. If reversing `x` causes the value to go outside the signed 32-bit integer range [-2<sup>31</sup>, 2<sup>31</sup> - 1], then return `0`.\n\n**Assume the environment does not allow you to store 64-bit integers (signed or unsigned).**\n\n**Example 1:**\n\n```\nInput: x = 123\nOutput: 321\n```\n\n**Example 2:**\n\n```\nInput: x = -123\nOutput: -321\n```\n\n**Example 3:**\n\n```\nInput: x = 120\nOutput: 21\n```\n\n**Constraints:**\n\n*   -2<sup>31</sup> <= x <= 2<sup>31</sup> - 1\n\n\n',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: '4Sum',
      content: '## Description\n\nRelated Topics: [Array], [Two Pointers], [Sorting]\n\n\nGiven an array `nums` of `n` integers, return _an array of all the **unique** quadruplets_ `[nums[a], nums[b], nums[c], nums[d]]` such that:\n\n*   `0 <= a, b, c, d < n`\n*   `a`, `b`, `c`, and `d` are **distinct**.\n*   `nums[a] + nums[b] + nums[c] + nums[d] == target`\n\nYou may return the answer in **any order**.\n\n**Example 1:**\n\n```\nInput: nums = [1,0,-1,0,-2,2], target = 0\nOutput: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]\n```\n\n**Example 2:**\n\n```\nInput: nums = [2,2,2,2,2], target = 8\nOutput: [[2,2,2,2]]\n```\n\n**Constraints:**\n\n*   `1 <= nums.length <= 200`\n*   -10<sup>9</sup> <= nums[i] <= 10<sup>9</sup>\n*   -10<sup>9</sup> <= target <= 10<sup>9</sup>\n\n',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Regular Expression Matching',
      content: '## Description\n\nDifficulty: **Hard**  \n\nRelated Topics: [String], [Dynamic Programming], [Recursion]\n\n\nGiven an input string `s` and a pattern `p`, implement regular expression matching with support for `.` and `*` where:\n\n*   `.` Matches any single character.\n*   `*` Matches zero or more of the preceding element.\n\nThe matching should cover the **entire** input string (not partial).\n\n**Example 1:**\n\n```\nInput: s = \"aa\", p = \"a\"\nOutput: false\nExplanation: \"a\" does not match the entire string \"aa\".\n```\n\n**Example 2:**\n\n```\nInput: s = \"aa\", p = \"a*\"\nOutput: true\nExplanation: `*` means zero or more of the preceding element, \"a\". Therefore, by repeating \"a\" once, it becomes \"aa\".\n```\n\n**Example 3:**\n\n```\nInput: s = \"ab\", p = \".*\"\nOutput: true\nExplanation: \".*\" means \"zero or more (*) of any character (.)\".\n```\n\n**Constraints:**\n\n*   `1 <= s.length <= 20`\n*   `1 <= p.length <= 30`\n*   `s` contains only lowercase English letters.\n*   `p` contains only lowercase English letters, `.`, and `*`.\n*   It is guaranteed for each appearance of the character `*`, there will be a previous valid character to match.\n\n',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Substring with Concatenation of All Words',
      content: '## Description\n\n\nRelated Topics: [Hash Table], [String], [Sliding Window]\n\n\nYou are given a string `s` and an array of strings `words`. All the strings of `words` are of **the same length**.\n\nA **concatenated substring** in `s` is a substring that contains all the strings of any permutation of `words` concatenated.\n\n*   For example, if `words = [\"ab\",\"cd\",\"ef\"]`, then `\"abcdef\"`, `\"abefcd\"`, `\"cdabef\"`, `\"cdefab\"`, `\"efabcd\"`, and `\"efcdab\"` are all concatenated strings. `\"acdbef\"` is not a concatenated substring because it is not the concatenation of any permutation of `words`.\n\nReturn _the starting indices of all the concatenated substrings in_ `s`. You can return the answer in **any order**.\n\n**Example 1:**\n\n```\nInput: s = \"barfoothefoobarman\", words = [\"foo\",\"bar\"]\nOutput: [0,9]\nExplanation: Since words.length == 2 and words[i].length == 3, the concatenated substring has to be of length 6.\nThe substring starting at 0 is \"barfoo\". It is the concatenation of [\"bar\",\"foo\"] which is a permutation of words.\nThe substring starting at 9 is \"foobar\". It is the concatenation of [\"foo\",\"bar\"] which is a permutation of words.\nThe output order does not matter. Returning [9,0] is fine too.\n```\n\n**Example 2:**\n\n```\nInput: s = \"wordgoodgoodgoodbestword\", words = [\"word\",\"good\",\"best\",\"word\"]\nOutput: []\nExplanation: Since words.length == 4 and words[i].length == 4, the concatenated substring has to be of length 16.\nThere is no substring of length 16 is s that is equal to the concatenation of any permutation of words.\nWe return an empty array.\n```\n\n**Example 3:**\n\n```\nInput: s = \"barfoofoobarthefoobarman\", words = [\"bar\",\"foo\",\"the\"]\nOutput: [6,9,12]\nExplanation: Since words.length == 3 and words[i].length == 3, the concatenated substring has to be of length 9.\nThe substring starting at 6 is \"foobarthe\". It is the concatenation of [\"foo\",\"bar\",\"the\"] which is a permutation of words.\nThe substring starting at 9 is \"barthefoo\". It is the concatenation of [\"bar\",\"the\",\"foo\"] which is a permutation of words.\nThe substring starting at 12 is \"thefoobar\". It is the concatenation of [\"the\",\"foo\",\"bar\"] which is a permutation of words.\n```\n\n**Constraints:**\n\n*   1 <= s.length <= 10<sup>4</sup>\n*   `1 <= words.length <= 5000`\n*   `1 <= words[i].length <= 30`\n*   `s` and `words[i]` consist of lowercase English letters.\n\n',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
 
    await queryInterface.bulkInsert('Categories', [{
      difficulty: 'easy',
      types: ['Array', 'Hash Table'],
      questionId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      difficulty: 'easy',
      types: ['Math'],
      questionId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      difficulty: 'medium',
      types: ['Math'],
      questionId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      difficulty: 'medium',
      types: ['Array', 'Two Pointers', 'Sorting'],
      questionId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      difficulty: 'hard',
      types: ['String', 'Dynamic Programming', 'Recursion'],
      questionId: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      difficulty: 'hard',
      types: ['Hash Table', 'String', 'Sliding Window'],
      questionId: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
 
  },
 
  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Categories', null, {});
    await queryInterface.bulkDelete('Questions', null, {});
  }
};
 

