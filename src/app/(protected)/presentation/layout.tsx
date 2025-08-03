import React from 'react'

type Props = {
  // Define any props if needed
  children: React.ReactNode;

}

const Layout = (props: Props) => {
  return (
    <div className='h-full w-full overflow-x-hidden'>
        {props.children}
    </div>
  )
}

export default Layout;