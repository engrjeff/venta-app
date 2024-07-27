import { Unit, UnitConversion } from "@prisma/client"

export type UnitWithConversion = Unit & {
  conversions: UnitConversion[]
}
