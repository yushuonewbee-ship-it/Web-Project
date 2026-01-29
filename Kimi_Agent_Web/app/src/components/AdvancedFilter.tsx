import { useState, useEffect } from 'react';
import { Plus, Minus, X, ChevronDown } from 'lucide-react';

export interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string | number | boolean;
}

export interface FilterGroup {
  id: string;
  logic: 'AND' | 'OR';
  conditions: FilterCondition[];
}

export interface FieldConfigItem {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'boolean';
  filterable?: boolean;
  options?: string[];
}

export interface OperatorConfigItem {
  value: string;
  label: string;
  types: string[];
}

export interface LogicOperatorItem {
  value: string;
  label: string;
}

interface AdvancedFilterProps {
  onFilterChange: (groups: FilterGroup[]) => void;
  fieldConfig: FieldConfigItem[];
  operators: OperatorConfigItem[];
  logicOperators: LogicOperatorItem[];
}

export default function AdvancedFilter({
  onFilterChange,
  fieldConfig,
  operators,
  logicOperators,
}: AdvancedFilterProps) {
  const [groups, setGroups] = useState<FilterGroup[]>([
    {
      id: '1',
      logic: 'AND',
      conditions: [{ id: '1-1', field: '', operator: '', value: '' }],
    },
  ]);
  const [isExpanded, setIsExpanded] = useState(false);

  // 当 fieldConfig 变化时，重置筛选条件（因为字段列表已改变）
  // 使用字段 key 的字符串作为依赖，确保能检测到变化
  const fieldKeys = fieldConfig.map((f) => f.key).join(',');
  useEffect(() => {
    const resetGroups = [
      {
        id: '1',
        logic: 'AND' as const,
        conditions: [{ id: '1-1', field: '', operator: '', value: '' }],
      },
    ];
    setGroups(resetGroups);
    onFilterChange(resetGroups);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldKeys]);

  const addGroup = () => {
    const newGroup: FilterGroup = {
      id: Date.now().toString(),
      logic: 'AND',
      conditions: [{ id: `${Date.now()}-1`, field: '', operator: '', value: '' }],
    };
    const newGroups = [...groups, newGroup];
    setGroups(newGroups);
    onFilterChange(newGroups);
  };

  const removeGroup = (groupId: string) => {
    const newGroups = groups.filter((g) => g.id !== groupId);
    setGroups(newGroups);
    onFilterChange(newGroups);
  };

  const addCondition = (groupId: string) => {
    const newGroups = groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: [
            ...group.conditions,
            { id: `${groupId}-${Date.now()}`, field: '', operator: '', value: '' },
          ],
        };
      }
      return group;
    });
    setGroups(newGroups);
    onFilterChange(newGroups);
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    const newGroups = groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: group.conditions.filter((c) => c.id !== conditionId),
        };
      }
      return group;
    });
    setGroups(newGroups);
    onFilterChange(newGroups);
  };

  const updateCondition = (
    groupId: string,
    conditionId: string,
    updates: Partial<FilterCondition>
  ) => {
    const newGroups = groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: group.conditions.map((c) =>
            c.id === conditionId ? { ...c, ...updates } : c
          ),
        };
      }
      return group;
    });
    setGroups(newGroups);
    onFilterChange(newGroups);
  };

  const updateGroupLogic = (groupId: string, logic: 'AND' | 'OR') => {
    const newGroups = groups.map((group) =>
      group.id === groupId ? { ...group, logic } : group
    );
    setGroups(newGroups);
    onFilterChange(newGroups);
  };

  const getFieldType = (fieldKey: string) => {
    if (!fieldKey) return 'text';
    const field = fieldConfig.find((f) => f.key === fieldKey);
    const fieldType = field?.type || 'text';
    return fieldType;
  };

  const getFieldOptions = (fieldKey: string) => {
    const field = fieldConfig.find((f) => f.key === fieldKey);
    return field?.options || [];
  };

  const getAvailableOperators = (fieldKey: string) => {
    if (!fieldKey) return [];
    const fieldType = getFieldType(fieldKey);
    // 确保运算符列表正确过滤
    const availableOps = operators.filter((op) => op.types.includes(fieldType));
    return availableOps;
  };

  const clearAllFilters = () => {
    const resetGroups = [
      {
        id: '1',
        logic: 'AND' as const,
        conditions: [{ id: '1-1', field: '', operator: '', value: '' }],
      },
    ];
    setGroups(resetGroups);
    onFilterChange(resetGroups);
  };

  const hasActiveFilters = groups.some((g) =>
    g.conditions.some((c) => c.field && c.operator && c.value !== '')
  );

  return (
    <div className="bg-white rounded-xl border border-mq-border overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-mq-paper/50 hover:bg-mq-paper transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-mq-ink">高级筛选</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-mq-red text-white text-xs rounded-full">
              已启用
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearAllFilters();
              }}
              className="text-xs text-mq-red hover:underline"
            >
              清除全部
            </button>
          )}
          <ChevronDown
            className={`w-5 h-5 text-mq-gray transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {groups.map((group, groupIndex) => (
            <div
              key={group.id}
              className="border border-mq-border rounded-lg p-4 bg-mq-paper/30"
            >
              {/* Group Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-mq-gray">条件组 {groupIndex + 1}</span>
                  <select
                    value={group.logic}
                    onChange={(e) => updateGroupLogic(group.id, e.target.value as 'AND' | 'OR')}
                    className="text-sm px-2 py-1 border border-mq-border rounded bg-white focus:border-mq-red focus:outline-none"
                  >
                    {logicOperators.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                </div>
                {groups.length > 1 && (
                  <button
                    onClick={() => removeGroup(group.id)}
                    className="text-mq-gray hover:text-mq-red transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Conditions */}
              <div className="space-y-2">
                {group.conditions.map((condition, conditionIndex) => (
                  <div key={condition.id} className="flex items-center gap-2">
                    <span className="text-xs text-mq-gray w-8">
                      {conditionIndex === 0 ? '如果' : group.logic === 'AND' ? '且' : '或'}
                    </span>

                    {/* Field Select */}
                    <select
                      value={condition.field}
                      onChange={(e) =>
                        updateCondition(group.id, condition.id, {
                          field: e.target.value,
                          operator: '',
                          value: '',
                        })
                      }
                      className="flex-1 min-w-0 text-sm px-3 py-2 border border-mq-border rounded-lg bg-white focus:border-mq-red focus:outline-none"
                    >
                      <option value="">选择字段</option>
                      {fieldConfig
                        .filter((f) => f.filterable)
                        .map((f) => (
                          <option key={f.key} value={f.key}>
                            {f.label}
                          </option>
                        ))}
                    </select>

                    {/* Operator Select */}
                    <select
                      value={condition.operator}
                      onChange={(e) =>
                        updateCondition(group.id, condition.id, { operator: e.target.value })
                      }
                      disabled={!condition.field}
                      className="w-28 text-sm px-3 py-2 border border-mq-border rounded-lg bg-white focus:border-mq-red focus:outline-none disabled:bg-mq-paper disabled:cursor-not-allowed"
                    >
                      <option value="">运算符</option>
                      {getAvailableOperators(condition.field).map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>

                    {/* Value Input */}
                    {condition.field && getFieldType(condition.field) === 'select' ? (
                      <select
                        value={condition.value as string}
                        onChange={(e) =>
                          updateCondition(group.id, condition.id, { value: e.target.value })
                        }
                        className="flex-1 min-w-0 text-sm px-3 py-2 border border-mq-border rounded-lg bg-white focus:border-mq-red focus:outline-none"
                      >
                        <option value="">选择值</option>
                        {getFieldOptions(condition.field).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : condition.field && getFieldType(condition.field) === 'boolean' ? (
                      <select
                        value={condition.value as boolean ? 'true' : condition.value === false ? 'false' : ''}
                        onChange={(e) =>
                          updateCondition(group.id, condition.id, {
                            value: e.target.value === 'true',
                          })
                        }
                        className="flex-1 min-w-0 text-sm px-3 py-2 border border-mq-border rounded-lg bg-white focus:border-mq-red focus:outline-none"
                      >
                        <option value="">选择</option>
                        <option value="true">是</option>
                        <option value="false">否</option>
                      </select>
                    ) : (
                      <input
                        type={getFieldType(condition.field) === 'number' ? 'number' : 'text'}
                        value={condition.value as string | number}
                        onChange={(e) =>
                          updateCondition(group.id, condition.id, {
                            value:
                              getFieldType(condition.field) === 'number'
                                ? Number(e.target.value)
                                : e.target.value,
                          })
                        }
                        placeholder="输入值"
                        className="flex-1 min-w-0 text-sm px-3 py-2 border border-mq-border rounded-lg bg-white focus:border-mq-red focus:outline-none"
                      />
                    )}

                    {/* Remove Condition */}
                    {group.conditions.length > 1 && (
                      <button
                        onClick={() => removeCondition(group.id, condition.id)}
                        className="text-mq-gray hover:text-mq-red transition-colors p-1"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Condition Button */}
              <button
                onClick={() => addCondition(group.id)}
                className="mt-3 text-sm text-mq-red hover:text-mq-red-dark flex items-center gap-1 transition-colors"
              >
                <Plus className="w-4 h-4" />
                添加条件
              </button>
            </div>
          ))}

          {/* Add Group Button */}
          <button
            onClick={addGroup}
            className="w-full py-2 border-2 border-dashed border-mq-border rounded-lg text-mq-gray hover:border-mq-red hover:text-mq-red flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加条件组
          </button>
        </div>
      )}
    </div>
  );
}
