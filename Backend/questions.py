problems_dict = {
    2239: 
    {
        "title": "Find Closest Number to Zero",
        "difficulty": "Easy",
        "description": "Given an integer array nums of size n, return the number with the value closest to 0 in nums. If there are multiple answers, return the number with the largest value.",
        "tags": ["Array"],
        "exampleInputs1": {"nums": [-4, -2, 1, 4, 8]},
        "exampleOutputs1": 1,
        "exampleInputs2": {"nums": [2, -1, 1]},
        "exampleOutputs2": 1
    },
    75:
    {
        
        "title": "Sort Colors",
        "difficulty": "Medium",
        "description": "Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue. We will use the integers 0, 1, and 2 to represent the color red, white, and blue, respectively. You must solve this problem without using the library's sort function.",
        "tags": ["Array", "Two Pointers", "Sorting"],
        "exampleInputs1": {"nums": [2, 0, 2, 1, 1, 0]},
        "exampleOutputs1": [0, 0, 1, 1, 2, 2],
        "exampleInputs2": {"nums": [2, 0, 1]},
        "exampleOutputs2": [0, 1, 2]
    },
    49:
    {
        "title": "Group Anagrams",
        "difficulty": "Medium",
        "description": "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
        "tags": ["Array", "Hash Table", "String", "Sorting"],
        "exampleInputs1": {"strs": [""]},
        "exampleOutputs1": [[""]],
        "exampleInputs2": {"strs": ["a"]},
        "exampleOutputs2": [["a"]]
    },
    977:
    {
        "title": "Squares of a Sorted Array",
        "difficulty": "Easy",
        "description": "Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.",
        "tags": ["Array", "Two Pointers", "Sorting"],
        "exampleInputs1": {"nums": [-4, -1, 0, 3, 10]},
        "exampleOutputs1": [0, 1, 9, 16, 100],
        "exampleInputs2": {"nums": [-7, -3, 2, 3, 11]},
        "exampleOutputs2": [4, 9, 9, 49, 121]
    },
    15:
    {
        "title": "3Sum",
        "difficulty": "Medium",
        "description": "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.",
        "tags": ["Array", "Two Pointers", "Sorting"],
        "exampleInputs1": {"nums": [0, 1, 1]},
        "exampleOutputs1": [],
        "exampleInputs2": {"nums": [0, 0, 0]},
        "exampleOutputs2": [[0, 0, 0]]
    },
    20:
    {
        "title": "Valid Parentheses",
        "difficulty": "Easy",
        "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.",
        "tags": ["String", "Stack"],
        "exampleInputs1": {"s": "()"},
        "exampleOutputs1": True,
        "exampleInputs2": {"s": "()[]{}"},
        "exampleOutputs2": True
    },
    739:
    {
        "title": "Daily Temperatures",
        "difficulty": "Medium",
        "description": "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.",
        "tags": ["Array", "Stack", "Monotonic Stack"],
        "exampleInputs1": {"temperatures": [73, 74, 75, 71, 69, 72, 76, 73]},
        "exampleOutputs1": [1, 1, 4, 2, 1, 1, 0, 0],
        "exampleInputs2": {"temperatures": [30, 40, 50, 60]},
        "exampleOutputs2": [1, 1, 1, 0]
    },
    1:
    {
        "title": "Two Sum",
        "difficulty": "Easy",
        "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
        "tags": ["Array", "Hash Table"],
        "exampleInputs1": {"nums": [2,7,11,15], "target": 9},
        "exampleOutputs1": [0,1],
        "exampleInputs2": {"nums": [3,2,4], "target": 6},
        "exampleOutputs2": [1,2]
      }
}
