import {
  Button,
  Divider,
  Input,
  Radio,
  RadioGroup,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@nextui-org/react";
import {  useState } from "react";
import { RenderAPITableCell } from "./renderTableCell";
import CustomModal from "../customModal";



const APIsetting = () => {
  const [createModal, setCreateModal] = useState(false);

  return <>
    <div className="text-lg font-bold px-1">Create new API key</div>
    <RadioGroup
      label="Owned by"
      orientation="horizontal"
      defaultValue={"you"}
    >
      <Radio value="you">You</Radio>
      <Radio value="service">Service Account</Radio>
    </RadioGroup>




    <Divider className="my-3" />
    <div className=" font-semibold">

      New
    </div>

    Permissions
    <br />
    <Tabs color="success" radius="sm">
      <Tab key="all" title="All" />
      <Tab key="restricted" title="Restricted" />
      <Tab key="readonly" title="Read Only" />
    </Tabs>
    <br />
    <div className="max-xs:block flex" >
      <Input
        color="default"
        className=" mt-2"
        placeholder="New API key name"
        classNames={{
          inputWrapper: "border-1 rounded-r-none max-xs:rounded-lg",
        }}
      />
      <Button
        color="success"
        className="max-xs:w-full w-1/3 mt-2 float-end max-xs:rounded-lg rounded-l-none"
        onClick={() => {
          setCreateModal(true);
        }}
      >
        Create API Key
      </Button>
    </div>



    <Divider className="my-3" />
    <Table
      isHeaderSticky
      className="overflow-hidden"
      classNames={{
        base: "max-h-[140px] overflow-scroll",
      }} aria-label="Example table with custom cells">
      <TableHeader columns={[{
        uid: 'name', name: 'Name'
      }, {
        uid: 'key', name: 'API key'
      }, {
        uid: 'permission', name: 'Permissions'
      }, {
        uid: 'actions', name: 'Actions'
      }
      ]}>
        {(column) => (
          <TableColumn key={column?.uid} align={'center'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={[
        {
          id: 0,
          name: 'KSKKA',
          key: 's5e4155sd2a1d55wwww',
          permission: 'al'
        },
        {
          id: 1,
          name: 'KSKKA',
          key: 's5e4155sd2a1d55wwww',
          permission: 'al'
        },
        {
          id: 2,
          name: 'KSKKA',
          key: 's5e4155sd2a1d55wwww',
          permission: 'al'
        },
        {
          id: 3,
          name: 'KSKKA',
          key: 's5e4155sd2a1d55wwww',
          permission: 'al'
        },
        {
          id: 4,
          name: 'KSKKA',
          key: 's5e4155sd2a1d55wwww',
          permission: 'al'
        },
        {
          id: 5,
          name: 'KSKKA',
          key: 's5e4155sd2a1d55wwww',
          permission: 'al'
        }
      ]}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{RenderAPITableCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
    <CustomModal
        width="w-[90%] xl:w-[60%]"
        isOpen={createModal}
        onClose={() => {
          setCreateModal(false);
        }}
      >
        <div className="text-xl font-bold text-center w-full p-4">
          Your Generated API Key
        </div>
        <div className="text-sm text-justify">
          Lorem ipsum dolor sit amet consectetur. Aliquam eu praesent faucibus
          morbi dolor mi. Feugiat id at ornare at donec ante massa. Sit volutpat
          elementum et consequat amet aliquet scelerisque. Hendrerit amet mauris
          quis quis faucibus scelerisque risus.
        </div>

        <div className="py-4 max-xs:block flex gap-1">
          <Input
            color="default"
            disabled
            placeholder="new"
            className="my-4"
            classNames={{
              inputWrapper: "border-1",
            }}
          />
          <Button color="success" className="max-xs:w-full my-4">
            Copy
          </Button>
        </div>
      </CustomModal>
  </>
}

export default APIsetting