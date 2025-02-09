from run_code import execute_code

solutions = {
    "two_sum": [1,
"""
def twoSum(nums, target):
    nums_dict = {}
    
    j = 0
    for i in nums:
        if target - i in nums_dict:
            return [nums_dict[target - i], j]
        else:
            nums_dict[i] = j
        j += 1
"""
    ],
    "group_anagrams": [49,
"""
def groupAnagrams(strs):
    anagramGroup = {}
    for i in strs:
        cur = "".join(sorted(i))
        if cur in anagramGroup:
            anagramGroup[cur].append(i)
        else:
            anagramGroup[cur] = [i]
    
    a = []
    for i in anagramGroup.values():
        a.append(i)

    return a
"""
    ],
    "3sum": [15, 
"""
def threeSum(nums):
    output = []
    nums.sort()
    n = len(nums)

    for i in range (n-2):
        left = i+1
        right = n-1

        if i > 0 and nums[i] == nums[i-1]:
            continue
        

        while right > left:
            total = nums[left] + nums[right] + nums[i]
                
            if total > 0:
                right -=1
            
            elif total < 0:
                left += 1
            else:
                output.append([nums[i], nums[left], nums[right]])
                left += 1

                while nums[left] == nums[left - 1] and left < right:
                    left += 1
            
    return output
"""]
}

def test_all_solutions():
    for i, solution in enumerate(solutions.values()):
        print(execute_code(solution[0], solution[1])) 
    print("ALL ASSERTION TESTS PASSED")
