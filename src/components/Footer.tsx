import useCart from '../hooks/useCart'



type PropsType = {
  viewCart: boolean
}

const Footer = ({ viewCart }: PropsType) => {
  const { totalItems, totalPrice } = useCart()
  const year: number = new Date().getFullYear()
  const pageContent = viewCart ?
    <p>Shopping cart &copy; {year} </p> :
    (
      <>
        <p>Total items: {totalItems}</p>
        <p>Total price: {totalPrice}</p>
        <p>Shopping cart &copy; {year} </p>
      </>
    )

  const content = (
    <footer className="footer">
      {pageContent}
    </footer>
  )
  return content
}

export default Footer